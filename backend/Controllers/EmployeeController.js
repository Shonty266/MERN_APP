const ViewEmployees = async (req, res) => {
    console.log('user', req.user)
    
    res.send('Employees route')
}

module.exports = ViewEmployees;
