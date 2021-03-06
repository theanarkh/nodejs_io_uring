const { read } = require('./build/Release/io_uring.node');
const { Readable } = require('stream');

class FileReader extends Readable {
    constructor(options = {}) {
        super(options);
        const {fd, offset, bufferSize} = options;
        this.fd = fd;
        this.offset = offset || 0;
        this.bufferSize = bufferSize;
    }

    _read() {
        const buffer = Buffer.allocUnsafe(this.bufferSize || 1024);
        read(this.fd, buffer, (error,offset) => {
            if (error) {
                this.emit('error', error);
            } else {
                this.offset += offset;
                this.push(offset > 0 ? buffer.slice(0, offset) : null);
            }
        }, this.offset);
    }
}

module.exports = {
    FileReader
};
