export type BlockType = 'hero' | 'gallery' | 'editorial' | 'features' | 'form';

export interface PageBlock {
  id: string;
  type: BlockType;
  data: any;
}
