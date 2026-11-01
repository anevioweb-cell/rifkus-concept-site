import { Link } from 'react-router';
import { ArrowIcon } from './icons/index.jsx';

const sizes = {
  md: 'min-h-15 px-6 text-small', // reference "Send message" / "Live site": 60 px tall
  sm: 'min-h-11 px-4 text-small',
  xl: 'min-h-20 px-6 text-lead-lg', // reference "See all projects" / "Live site": 80 px tall, 24 px label
};

const variants = {
  // Reference outlined button: 1 px border, radius 4, transparent; fills on hover.
  outline: 'border border-white/60 text-white hover:border-white hover:bg-white hover:text-ink',
  solid: 'border border-white bg-white text-ink hover:bg-mist hover:border-mist',
  // Solid brand yellow on ink sections (ink text 13.46:1), lighter on hover.
  brand: 'border border-brand bg-brand text-ink hover:border-brand-soft hover:bg-brand-soft',
};

/**
 * Button or link with the reference's outlined style. Renders <Link> for
 * `to`, <a> for `href`, otherwise <button>. Disabled buttons keep focus
 * via aria-disabled (the reference dims them to 0.4).
 *
 * @param {object} props
 * @param {string} [props.to] internal route (renders a router <Link>)
 * @param {string} [props.href] external URL (renders <a>)
 * @param {'outline' | 'solid' | 'brand'} [props.variant='outline']
 * @param {'sm' | 'md' | 'xl'} [props.size='md'] 44 / 60 / 80 px tall
 * @param {boolean} [props.arrow=false] trailing arrow icon
 * @param {string} [props.className] extra classes (layout only)
 */
export function Button({ to, href, variant = 'outline', size = 'md', arrow = false, className = '', children, ...props }) {
  const classes = [
    'group inline-flex items-center justify-center gap-2 rounded-ui font-normal',
    'transition-colors duration-(--duration-hover) ease-snap aria-disabled:pointer-events-none aria-disabled:opacity-40',
    sizes[size],
    variants[variant],
    className,
  ].join(' ');
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon className="size-3.5 transition-transform duration-(--duration-hover) group-hover:translate-x-1" />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
