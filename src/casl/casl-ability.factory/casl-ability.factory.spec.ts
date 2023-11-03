import { CaslAbilityFactory } from './casl-ability.factory';
import { it, expect, describe } from 'vitest';

describe('CaslAbilityFactory', () => {
  it('should be defined', () => {
    expect(new CaslAbilityFactory()).toBeDefined();
  });
});
