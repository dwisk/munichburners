import { getPage } from '../../lib/notion';

export default async (req, res) => {
    const page = await getPage(req.query.id, req.query.codeword || false);

    res.statusCode = 200;
    res.json({ page})
}
