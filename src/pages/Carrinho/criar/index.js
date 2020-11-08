import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import './index.css';
 
class CriarCarrinho extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            carrinho: {
                nomePedido: "",
                nomeCliente: "",
                qtde: ""
            },
            pedidos: [],
            erro: null,
            erroNomePedido: null,
            redirect: false
        };
    }

    exibeErroNomePedido() {
        const { erroNomePedido } = this.state;
 
        if (erroNomePedido) {
            return (
                <div className="alert alert-danger" role="alert">
                    O nome do seu pedido não existe.
                </div>
            );
        }
    }
 
    exibeErro() {
        const { erro } = this.state;
 
        if (erro) {
            return (
                <div className="alert alert-danger" role="alert">
                    Erro de conexão com o servidor
                </div>
            );
        }
    }

    componentDidMount() {
        fetch(`https://lokky-back2.herokuapp.com/sistema/pedidos`)
            .then(pedido =>
                pedido.json().then(pedidos => this.setState({ pedidos }))
            )
            .catch(erro => this.setState({ erro }));
    }
 
    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to="/carrinhos" />;
        } else {
            return (
            <div id="formulario">   
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend id="title"><h1>Criar Pedido</h1></legend>
                        <div className="usuario-insert-left">
                            <label htmlFor="nomePedido"><h3>Nome do Pedido</h3></label>
                            <br />
                            <input
                                type="text"
                                id="nomePedido"
                                name="nomePedido"
                                placeholder="EX: x-burguer"
                                minLength="1"
                                maxLength="100"
                                required
                                value={this.state.carrinho.nomePedido}
                                onChange={this.handleInputChange}
                            />
                        </div>
                
                        <div className="usuario-insert-right">
                            <label htmlFor="nomeCliente"><h3>Usuário</h3></label>
                            <br />
                            <input
                                type="text"
                                id="nomeCliente"
                                name="nomeCliente"
                                placeholder="usuário"
                                minLength="1"
                                maxLength="100"
                                required
                                value={this.state.carrinho.nomeCliente}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="usuario-insert-left">
                            <label htmlFor="qtde"><h3>Quantidade</h3></label>
                            <br />
                            <input
                                type="text"
                                id="qtde"
                                name="qtde"
                                placeholder="EX: 2"
                                minLength="1"
                                maxLength="100"
                                required
                                value={this.state.carrinho.qtde}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div id="cadastrar2"><button type="submit" id="cadastrar2-button">Concluir</button></div> 
                    </fieldset>
                </form>
            </div>
            
            );
        }
    }
 
    handleInputChange = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
 
        this.setState(prevState => ({
            carrinho: { ...prevState.carrinho, [name]: value }
        }));

        console.log(value);
    };
 
    handleSubmit = event => {
        const { carrinho, pedidos } = this.state

        const nomePedidoPedidos = pedidos.map(pedido => pedido.nomePedido)

        if (nomePedidoPedidos != carrinho.nomePedido)
            return alert('Nome do pedido não existe.')

        fetch("https://lokky-back2.herokuapp.com/sistema/carrinhos", {
            method: "post",
            body: JSON.stringify(carrinho),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => {
                if (data.ok) {
                    this.setState({ redirect: true });
                } else {
                    data.json().then(data => {
                        if (data.error) {
                            this.setState({ erro: data.error });
                        }
                    });
                }
            })
            .catch(erro => this.setState({ erro: erro }));
 
        event.preventDefault();
    };
}
 
export default CriarCarrinho;
