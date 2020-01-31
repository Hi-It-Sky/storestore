'use strict';

const e = React.createElement;

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
          };
    }

    getAction(url){
        console.log(url);
        this.setState({
          isLoaded: false
        });
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.state.items=[];
              this.setState({
                isLoaded: true,
                items: result
              });
              //alert(JSON.stringify(this.result))
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )

    }

    getCart() {
        var url="http://localhost:3001/local/cart";
        this.getAction(url);
      }
  
    incItemCount(id) {
        var url="http://localhost:3001/local/incitemcount/"+id;
        this.getAction(url);
    }

    decItemCount(id) {
        var url="http://localhost:3001/local/decitemcount/"+id;
        this.getAction(url);
    }

    removeItem(id) {
        var url="http://localhost:3001/local/removeitem/"+id;
        this.getAction(url);
    }
    

    componentDidMount() {
      this.getCart();
    }

      handleChange(event) {
        this.getCart();
      }

      render() {

        const { error, isLoaded, items } = this.state;
        //alert('x' +this.state.items.length);
        if (error) {
            return e('div' ,{},'Error' +error);
        } else if (!isLoaded) {
            return e('div',{},'Loading...');
        } else {
            var tot=0;
            for(var i=0;i<items.length;i++){
                tot+=items[i].details.salePrice*items[i].count;
            }
            return(
              <div><h4 class="header">My Cart <a href="/index.html">Home</a></h4>
            <table>
              <thead>
                <tr class="cart"><th>sku</th><th>Name</th><th>Price</th><th>Page</th><th>Count</th><th>Action</th></tr>
              </thead>
              <tbody>
            {items.map(item => (
              <tr class="cart" key={item._id}>
                <td>{item.details.sku}</td>
                <td>{item.details.name}</td>
                <td class="number">{item.details.salePrice}</td>
                <td><a href={item.details.url}>Webpage</a></td>
                <td>{item.count}</td>
                <td><button onClick = {() => this.decItemCount(item._id)}>-</button>
                <button onClick = {() => this.incItemCount(item._id)}>+</button>
                <button onClick = {() => this.removeItem(item._id)}>Remove</button></td>
              </tr>
            ))}
            <tr class = "cart total" key="total"><td colspan="2">Total Cost</td><td class="number">{tot}</td><td colspan="3">&nbsp;</td></tr>
            </tbody>
          </table>
          </div>
            );
        }
      }
}

const domContainer = document.querySelector('#cart');
ReactDOM.render(e(Cart), domContainer);

