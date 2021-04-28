const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => {
    // console.log(requireContext.keys());
    return requireContext.keys().map(requireContext);
}

requireAll(req);