import Image from 'next/image'

export default function SvgImage({ src, alt, size }: { src: any; alt: string; size?: number }) {
    return <Image src={src.src} width={size || src.width} height={size || src.height} alt={alt} />
}