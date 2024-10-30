import { useState, useEffect, Fragment } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';
import UsersView from './UsersView';

const UsersContainer = () => {
    const [dataUsers, setDataUsers] = useState([]),
        [loadingUsers, setLoadingUsers] = useState(true);

    const getDataUsers = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users")
            console.log("response", response)
            if (!response.ok) {
                console.log("Hubo un error en la peticion")
            }

            const results = await response.json()
            setDataUsers(results)
        } catch (error) {
            console.log("Hubo un error en la api ", error)
        } finally {
            setLoadingUsers(false)
        }
    }

    console.log("dataUsers", dataUsers)

    useEffect(() => {
        getDataUsers()
    }, [])

    return (
        <UsersView loadingUsers={loadingUsers} dataUsers={dataUsers} />
    )

}

export default UsersContainer