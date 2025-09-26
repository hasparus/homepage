import og from "../../../api/og";

export const GET = async (req: Request) => {
  return await og(req);
};
