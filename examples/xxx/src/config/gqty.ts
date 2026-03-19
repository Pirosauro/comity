/**
 * GQty configuration file for the example project.
 */
type Introspections = Record<string, Pick<RequestInit, "headers">>;

const endpoint: Introspections = {
  "https://1aba42f5.ho.net.co/graphql": {
    // headers: {
    //   Authorization: "Bearer YOUR_TOKEN_HERE",
    // },
  },
};

export default endpoint;
