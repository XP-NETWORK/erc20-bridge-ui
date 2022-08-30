(() => {
  const widget = document.getElementById("erc20BrodgeWidget");

  const url = widget?.getAttribute("src")?.split("?");

  if (window.ethereum && url) {
    window.ethereum.on("accountsChanged", function (acc) {
      widget?.contentWindow?.postMessage(
        {
          type: "ethAddress",
          address: acc[0],
        },
        url[0]
      );
    });
  }
})();
