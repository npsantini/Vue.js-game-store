Vue.component("price", {
    data: function() {
        return {
        }
    },
    props: {
        value: Number,
        prefix: {
            type: String,
            default: '$'
        },
        precision: {
            type: Number,
            default: 2
        },
        conversion: {
            type: Number,
            default: 1
        }
    },
    template: '<span>{{ this.prefix + Number.parseFloat(this.value * this.conversion).toFixed(this.precision) }}</span>'
});

Vue.component("product-list", {
    props: ['products', 'maximum'],
    template: `
        <div class="row display-flex">
            <div class="col-3 d-flex mb-3 align-items-center p-2"
                v-for="item in products"
                v-if="item.price<=Number(maximum)">
                <div class="col-12 bg-white rounded-3 p-2">
                    <img class="img-fluid d-block m-auto" :src="item.image" :alt="name">
                    <h3 class="h4 text-dark text-truncate">{{ item.title }}</h3>
                    <p class="mb-0">{{ item.platform }}</p>
                    
                    <div class="h5 float-right">
                        <price  :value="Number(item.price)"></price>
                    </div>
                    <button class="btn btn-primary" @click="$emit('add', item)">Add to Cart</button>
                </div>
            </div>
        </div>
    `
});

var app = new Vue({
    el: '#app',
    data: {
        maximum: 60,
        products: null,
        cart: []
    },
    filters: {
        currency: function(value){
            return "$" + Number.parseFloat(value).toFixed(2);
        }
    },
    computed: {
        cartTotal: function(){
            let sum = 0;
            for (key in this.cart) {
                sum = sum + (this.cart[key].product.price * this.cart[key].qty);
            }
            return sum;
        },
        cartQty: function(){
            let qty = 0;
            for (key in this.cart) {
                qty = qty + this.cart[key].qty;
            }
            return qty;
        }
    },
    methods: {
        addItem: function(product) {
            var whichProduct;
            var existing = this.cart.filter(function(item, index) {
                if (item.product.id == Number(product.id)) {
                    whichProduct = index;
                    return true;
                } else {
                    return false;
                }
            });

            if (existing.length){
                this.cart[whichProduct].qty++;
            } else {
                this.cart.push({product: product, qty: 1});
            }
        },
        deleteItem: function(id){
            if (this.cart[id].qty > 1) {
                this.cart[id].qty--;
            } else {
                this.cart.splice(id,1);
            }
        }
    },
    mounted: function() {
        fetch('data/gamedata.json')
        .then(response => response.json())
        .then(data=>{
            this.products = data;
        })
    }
});