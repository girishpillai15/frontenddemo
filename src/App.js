import React, { Component } from 'react'
import DisplayDataTable from "./displayDataTable";
import './App.css';
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDialogData: []
    }
  }
  componentDidMount() {
    fetch("https://api.stackexchange.com/2.2/search/advanced?page=1&pagesize=20&order=desc&sort=activity&site=stackoverflow")
      .then(response => response.json())
      .then(responseJson => {
        for (var i = 0; i < responseJson.items.length; i++) {
          this.setState({
            selectedDialogData: [...this.state.selectedDialogData, {
              "Author": responseJson.items[i].owner.display_name,
              "Title": responseJson.items[i].title,
              "Creation_Date": responseJson.items[i].creation_date,
              "link": responseJson.items[i].link
            }]
          })
        }
      })
  }
  render() {
    return (
      <div className="data-table-div">
      {this.state.selectedDialogData.length > 0 &&
      <DisplayDataTable
        page={0}
        limit={20}
        data={this.state.selectedDialogData}
      />}
    </div>
    )
  }
}
