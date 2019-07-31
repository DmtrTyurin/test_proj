class User extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {data: props.user};
    }
    render(){
        return <div>
            <p><b>Name:</b> {this.state.data.name}</p>
            <p><b>Surname:</b> {this.state.data.surName}</p>
        </div>;
    }
}
 
class UserForm extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {name: "", surname: ""};
 
        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onSurnameChange = this.onSurnameChange.bind(this);
    }
    onNameChange(e) {
        this.setState({name: e.target.value});
    }
    onSurnameChange(e) {
        this.setState({surname: e.target.value});
    }
    onSubmit(e) {
        e.preventDefault();
        var userName = this.state.name.trim();
        var userSurname = this.state.surname.trim();
        if (!userName || !userSurname) {
            return;
        }
        this.props.onUserSubmit({ name: userName, surname: userSurname });
        this.setState({ name: "", surname: "" });
    }
    render() {
        return (
          <form onSubmit={this.onSubmit}>
              <p>
                  <input type="text"
                         placeholder="Name"
                         value={this.state.name}
                         onChange={this.onNameChange} />
              </p>
            <p>
                <input type="text"
                        placeholder="Surname"
                        value={this.state.surname}
                       onChange={this.onSurnameChange} />
            </p>
            <input type="submit" value="Save" />
          </form>
        );
    }
}
 
 
class UsersList extends React.Component{
 
    constructor(props){
        super(props);
        this.state = { users: [] };
 
        this.onAddUser = this.onAddUser.bind(this);
    }
    // загрузка данных
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ users: data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadData();
    }
    // добавление объекта
    onAddUser(user) {
        if (user) {

            var data = JSON.stringify({ "name": user.name, "surname": user.surname });
            var xhr = new XMLHttpRequest();
             
            xhr.open("post", this.props.apiUrl, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                if (xhr.status == 200) {
                    this.loadData();
                }
            }.bind(this);
            xhr.send(data);
        }
    }
    
    render(){
 
        return <div>
                <UserForm onUserSubmit={this.onAddUser} />
                <h2>List: </h2>
                <div>
                    {
                    this.state.users.map(function(user){

                        return <User key={user.id} user={user} />
                    })
                    }
                </div>
        </div>;
    }
}

ReactDOM.render(
    <UsersList apiUrl="/api/values" />,
    document.getElementById("content")
);