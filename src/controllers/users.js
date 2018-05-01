module.exports = {
  downServer(req, res, io) {
    // return io.on('connection', socket => {
    //   socket.emit('message', 'something');
    //   return res.status(200).send({});
    // });
    io.emit('message', 'something');
    res.status(200).send({});
  },
};
