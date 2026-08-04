const App = () => {
  const handleclick = () => {
    alert("Button Clicked!");
  };

  const handleparamclick = (msg) => {
    alert(msg);
  };

  return (
    <>
      <h1>{2 + 3}</h1>
      <div>App</div>
      <div>Hello</div>
      <button onClick={handleclick}>Click</button>
      <button onClick={() => handleparamclick("bujh gye diye!")}> Click(param)</button>
    </>
  );
};

export default App;