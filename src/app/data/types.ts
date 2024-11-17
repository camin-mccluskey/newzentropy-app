export type Story = {
  uuid: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
  source: string;
  publishedAt: string
  embedding: number[]
}