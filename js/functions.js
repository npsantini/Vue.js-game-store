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