import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results.map(removeSecretProperties );
};

export const getPage = async (pageId, codeword = false) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  response.lastFetch = new Date().getTime();
  return removeSecretProperties(response, codeword);
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};


function removeSecretProperties(page, codeword) {
  const nosecrets = page;
  if(page.properties.Codeword?.rich_text[0]?.plain_text !== codeword) {
    delete page.properties.Secret;
  }
  delete page.properties.Codeword;

  return nosecrets;
}