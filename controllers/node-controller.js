const { autoChain } = require("../utilities/config.js");

exports.broadcastNode = async (req, res) => {
  const url = req.body.nodeUrl;

  if (!autoChain.networkNodes.includes(url)) {
    autoChain.networkNodes.push(url);
  }

  autoChain.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/register-node`, { nodeUrl: url });
  });

  const allNodes = { nodes: [...autoChain.networkNodes, autoChain.nodeUrl] };

  await axios.post(`${url}/api/register-nodes`, allNodes);

  res.status(201).json({ success: true, data: url });
};

exports.addNode = (req, res) => {
  const url = req.body.nodeUrl;

  if (!autoChain.networkNodes.includes(url) && url !== autoChain.nodeUrl) {
    autoChain.networkNodes.push(url);
  }
  res.status(201).json({ success: true, data: url });
};

exports.addNodes = (req, res) => {
  const nodes = req.body.nodes;
  nodes.forEach((node) => {
    if (!autoChain.networkNodes.includes(node) && node !== autoChain.nodeUrl)
      autoChain.networkNodes.push(node);
  });

  res.status(200).json({
    note: "New nodes have been added",
    nodes: nodes,
  });
};
