interface LogoProps {
  href?: string
}

/** LUMA wordmark with the little equalizer mark. */
export default function Logo({ href = '#' }: LogoProps) {
  return (
    <a href={href} className="logo">
      <span className="logo-mark">
        <span>
          <i style={{ height: '6px' }} />
          <i style={{ height: '13px' }} />
          <i style={{ height: '9px' }} />
          <i style={{ height: '15px' }} />
          <i style={{ height: '7px' }} />
        </span>
      </span>
      LUMA
    </a>
  )
}
