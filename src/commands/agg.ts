import { CommandHandler } from "./commands";
import { fetchFeed } from "../lib/rss";

export const handlerAgg: CommandHandler = async (_) => {
  console.log(
    JSON.stringify(
      await fetchFeed("https://www.wagslane.dev/index.xml"),
      null,
      2
    )
  );
};
