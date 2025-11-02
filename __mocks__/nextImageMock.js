module.exports = (props) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
};
