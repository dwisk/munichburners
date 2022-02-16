import { getBlocks, getPage } from '../../lib/notion';

export default async (req, res) => {
    const page = await getPage(req.query.id, req.query.codeword || false);
    let blocks;

    if (req.query.blocks) {
        blocks = await getBlocks(page.id, true);
    }

    res.statusCode = 200;
    res.json({ page, blocks })
}
