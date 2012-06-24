
slice = function(bytes, start, opt_end) {
  if ('function' === typeof bytes.slice) {
    return bytes.slice(start, opt_end);
  }
  var len = bytes.length;
  var end = opt_end || len;
  if (start < 0) start = 0;
  if (end > len) end = len;
  var ret = new Uint8Array(new Array(end - start));
  for (var i = start; i < end; ++i) {
    ret[i - start] = bytes[i];
  }
  return ret;
}


bytesToString = function(bytes) {
  return String.fromCharCode.apply(null, bytes);
};

onMessage = function(event) {
  var buf = event.data.buffer;
  var bytes = new Uint8Array(buf);
  var str = bytesToString(slice(bytes, 0, 2));
  postMessage({'tags': str});
};

addEventListener('message', onMessage, false);
