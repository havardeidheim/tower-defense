import { AreaTower } from './AreaTower';
import { NormalTower } from './NormalTower';
import { PoisonTower } from './PoisonTower';
import { SpreadTower } from './SpreadTower';
import type { Tower } from './Tower';
import type { TowerType } from './TowerTypes';

export function createTower(type: TowerType, col: number, row: number): Tower {
  switch (type) {
    case 'Normal':
      return new NormalTower(col, row);
    case 'Area':
      return new AreaTower(col, row);
    case 'Spread':
      return new SpreadTower(col, row);
    case 'Poison':
      return new PoisonTower(col, row);
  }
}
