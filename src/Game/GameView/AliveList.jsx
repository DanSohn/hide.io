import React, { Component } from "react";
import "../../assets/App.css";

class AliveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };

        this.tabFunction = this.tabFunction.bind(this);
        this.tabFunctionUp = this.tabFunctionUp.bind(this);
    }

    tabFunction(event) {
        if (event.keyCode === 16) {
            this.setState({
                show: true,
            });
        }
    }

    tabFunctionUp(event) {
        if (event.keyCode === 16) {
            this.setState({
                show: false,
            });
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.tabFunction);
        document.addEventListener("keyup", this.tabFunctionUp);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.tabFunction);
        document.removeEventListener("keyup", this.tabFunctionUp);
    }

    render() {
        let comp = <></>;
        // if (this.state.show === true) {
        comp = (
            <div className="alivePlayers">
                <ul className="aliveList">
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                    <li>
                        <img src="https://scontent.fyyc5-1.fna.fbcdn.net/v/t31.0-8/21743593_2110943032265084_6203761706521445673_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_oc=AQlDJBhH_6U0KA1xQ-EqEn8oH3PVboShBOYtAlCNGUMMibi5lGFE02Q8aISjPD6HdhzaZpz6xjxPYgIeI2jzxTrq&_nc_ht=scontent.fyyc5-1.fna&oh=abde33669f8da29cfe3a140b08b570b0&oe=5EB25D58" />
                    </li>
                </ul>
            </div>
        );
        // }

        return <>{comp}</>;
    }
}
export default AliveList;
