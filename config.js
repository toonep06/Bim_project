const config = {
    api_path: 'http://localhost:3000',
    tokne_name: 'token',
    headers: () => {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }
}

export default config;