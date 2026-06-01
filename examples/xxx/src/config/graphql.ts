import { WsGraphqlTransport } from "@comity/graphql-client-ws";
import { CombinedGraphqlTransport, FetchGraphqlTransport } from "@comity/graphql-client/transports";

const fetchTransport = new FetchGraphqlTransport({
  url: "https://mage-os.extension.jajuma.de/graphql",
  // headers: {
  //   Authorization
  // }
});

const wsTransport = new WsGraphqlTransport({
  url: "wss://mage-os.extension.jajuma.de/graphql",
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
