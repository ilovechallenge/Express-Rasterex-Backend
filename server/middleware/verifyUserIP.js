module.exports = (socket, next) => {
    const ipAddress = socket.handshake.address;
    socket.address = ipAddress !== null ? ipAddress : process.env.DOMAIN;
    socket.connectedAt = new Date();

    if (isIPAllowed(ipAddress)) {
        next();
    } else {
        next(new Error('Invalid IP'));
    }
};

function isIPAllowed(ipAddress) {
    // TODO: IP check logic here
    return true;
}
