import { Ar } from './Ar.jsx';

/**
 * A flavor's display name. Brand words with an Arabic form (Zfiti → «زفيطي»,
 * owner decision) are always written in Arabic; the others in English.
 */
export function FlavorName({ flavor, className = '' }) {
  if (flavor.nameAr) return <Ar className={className}>{flavor.nameAr}</Ar>;
  return <span className={className}>{flavor.name}</span>;
}
