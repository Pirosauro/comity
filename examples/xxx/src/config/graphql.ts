import { WsGraphqlTransport } from "@comity/graphql-client-ws";
import { CombinedGraphqlTransport, FetchGraphqlTransport } from "@comity/graphql-client/transports";

const fetchTransport = new FetchGraphqlTransport({
  url: "https://magento2-demo.scandiweb.com/graphql",
  // headers: {
  //   Authorization
  // }
});

const wsTransport = new WsGraphqlTransport({
  url: "wss://magento2-demo.scandiweb.com/graphql",
  // connectionParams: {
  //   headers: {
  //     Authorization
  //   }
  // }
});

const transport = new CombinedGraphqlTransport({
  execute: fetchTransport.execute.bind(fetchTransport),
  subscribe: wsTransport.subscribe.bind(wsTransport),
});

export default transport;
