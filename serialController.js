const handleSerialData = async (io, data) => {
  const enc = new TextDecoder();
  const arr = new Uint8Array(data);
  const ready = enc.decode(arr);
  console.log(ready);

  try {
    await io.emit('arduino.data', {
      value: ready.toString(),
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handleSerialData,
};
