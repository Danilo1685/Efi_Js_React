import { Fragment } from "react"
import { ProgressSpinner } from "primereact/progressspinner"

const UsersView = ({ loadingUsers, dataUsers }) => {
    return (
        <Fragment>
            {loadingUsers ?
                <ProgressSpinner />
                :
                dataUsers.map((user) => (
                    <div key={user.id}>
                        <h3>Nombre: {user.name}</h3>
                        <h3>Calle: {user.address.street}</h3>
                    </div>
                    // <h1 key={user.id}>{user.name}</h1>
                ))
            }
        </Fragment>
    )
}
export default UsersView