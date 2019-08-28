export default () => {
  const host = window.location.protocol + '//' + window.location.hostname;
  return host + ':' + window.location.port;
};
