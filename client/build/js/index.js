 'use strict';

 const e = React.createElement;

// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }

//   render() {
//     if (this.state.liked) {
//       return 'You liked this.';
//     }

//     return e(
//       'button',
//       { onClick: () => this.setState({ liked: true }) },
//       'Like'
//     );
//   }
// }
// const domContainer = document.querySelector('#like_button_container');
// ReactDOM.render(e(LikeButton), domContainer);

class Searchbox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<input onKeyUp= { (e) => {if(e.keyCode === 13){ ReactDOM.render (
            <ProductList search="samsung"/>, document.querySelector('#results')
                 ) } }}/>  );
    }
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.searchterm='top';
        this.state = {
            error: null,
            isLoaded: false,
            items: []
          };
    }

    putItemInCart(obj){
      var url="http://localhost:3001/local/additem";
      console.log(url);
      fetch(url, { method: 'put',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)})
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true
            });
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

    doSearch(searchterm) {
      this.searchterm=searchterm;
      //alert(searchterm);
      var url="http://localhost:3001/API/products?q="+this.searchterm;
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
            //alert(this.state.items.length);
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
  

    componentDidMount() {
      this.doSearch('top');
    }

      handleChange(event) {
        //alert("here");
        this.doSearch(this.event.target.value);
      }

      render() {

        const { error, isLoaded, items } = this.state;
        //alert('x' +this.state.items.length);
        if (error) {
            return e('div' ,{},'Error' +error);
        } else if (!isLoaded) {
            return e('div',{},'Loading...');
        } else {
            return(
              <div>
                <h4 class="header">Items - {this.searchterm} <a href="cart.html"><img class="cart" src="cart.png"/></a></h4>
                <span class="search">Search:<input onKeyUp= { (e) => {if(e.keyCode === 13) {this.event=e;this.handleChange(e)}}}/></span>
                <table>
                  <thead>
                    <tr class="results"><th>sku</th><th>Name</th><th>Price</th><th>Page</th><th></th></tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr class="results" key={item.sku}>
                        <td>{item.sku}</td>
                        <td>{item.name}</td>
                        <td class="number">{item.salePrice}</td>
                        <td><a href={item.url}>Webpage</a></td>
                        <td><button onClick = {() => this.putItemInCart(item)}>Add</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      }
}

const domContainer = document.querySelector('#results');
ReactDOM.render(e(ProductList), domContainer);

