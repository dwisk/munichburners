import { ImageResponse } from 'next/og';

 
// export const runtime = 'edge';
 
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
 
    let icon = "data:image/svg+xml,<svg width='225' height='277' viewBox='0 0 225 277' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M120.212 190.426C120.212 190.426 127.253 203.142 102.516 223.664C76.5561 245.2 66.5891 250.871 56.9007 253.486C50.8476 255.121 38.9977 253.345 44.3869 239.355C63.8749 231.571 68.7498 229.712 83.1949 219.074C101.218 205.802 120.212 190.426 120.212 190.426ZM120.928 206.833C120.928 206.833 139.048 229.255 167.476 238.691C175.205 241.256 172.23 256.796 154.575 252.814C143.683 250.357 122.688 239.628 109.938 221.583C116.142 217.06 120.928 206.833 120.928 206.833ZM64.8882 254.28C64.8882 254.28 82.3107 264.233 105.153 263.786C127.996 263.339 139.863 260.65 151.416 254.649C137.023 251.408 124.878 241.513 124.878 241.513C124.878 241.513 102.033 246.267 87.5041 239.839C78.8028 247.244 64.8882 254.28 64.8882 254.28ZM103.316 170.209C103.316 170.209 84.9136 157.944 70.0578 160.216C56.642 162.269 37.7442 166.906 31.7187 193.909C26.2589 218.373 39.2625 233.666 42.2415 236.42C52.1371 233.218 62.9684 227.83 62.9684 227.83C62.9684 227.83 46.2267 216.45 50.0961 199.735C56.8585 170.529 88.0077 182.114 92.3115 184.343C94.5283 176.603 103.316 170.209 103.316 170.209ZM45.8345 165.381C49.512 162.826 53.6868 161.093 58.2885 160.384C42.5623 148.676 39.264 130.048 39.264 130.048C39.264 130.048 12.061 178.352 28.6898 214.664C27.2053 203.28 28.577 192.286 32.2752 183.181C29.7468 171.73 37.2599 151.797 37.2599 151.797C37.2599 151.797 38.5602 161.474 45.8345 165.381ZM95.074 205.549C93.7653 199.987 91.6329 186.477 100.165 177.581C108.696 168.686 123.292 160.739 141.922 160.949C164.642 161.206 181.254 177.784 182.605 200.181C184.358 229.261 170.163 236.098 170.163 236.098C170.163 236.098 161.847 234.548 152.199 228.253C158.752 222.539 174.509 205.715 158.644 189.071C134.334 163.57 106.719 197.965 95.074 205.549ZM185.789 207.247C185.688 213.086 184.803 218.956 183.123 224.541C208.637 197.732 198.821 141.281 198.821 141.281C198.821 141.281 195.201 160.52 178.147 176.786C180.218 180.19 181.873 183.936 183.105 187.895C189.383 184.576 193.332 171.557 193.332 171.557C193.332 171.557 190.675 197.111 185.789 207.247ZM114.963 276.809C92.204 277.607 22.3343 279.557 0 196.648C42.6475 232.517 -25.0838 180.553 44.0169 94.653C42.286 116.519 53.5118 130.103 53.5118 130.103C53.5118 130.103 44.066 30.1788 156.791 0C113.833 102.434 164.916 105.217 179.205 158.933C190.932 139.786 182.719 128.333 205.295 112.209C198.755 133.349 221.853 147.771 220.543 180.544C219.191 214.364 195.886 221.846 193.005 233.746C206.369 229.01 225 210.738 225 210.738C225 210.738 191.911 274.113 114.963 276.809ZM144.701 158.046C153.372 158.695 162.103 161.619 169.647 168.106C154.234 134.202 104.199 116.942 132.511 28.3627C47.0388 61.0737 72.3191 156.207 72.3191 156.207C72.3191 156.207 78.3039 156.235 86.2192 158.489C80.5652 146.452 70.7647 75.7681 114.475 51.6989C99.1376 108.978 138.675 151.919 144.701 158.046Z' fill='white'/></svg>";

    let title = 'Munich Burners';
    if (searchParams.has('title')) {
        title = `${searchParams.get('title') }`;
    }

    // const fontData = await fetch(
    //   new URL('../../../assets/Tourney-Semibold.ttf', import.meta.url),
    // ).then((res) => res.arrayBuffer());

    const fontData = fs.promises.readFile(
      path.join(fileURLToPath(import.meta.url), '../../assets/TYPEWR__.ttf'),
    );
    
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            backgroundSize: '1200px 800px',
            backgroundPosition: '0px -170px',
            backgroundImage: `url('https://munichburners.de/background-red.jpg')`,
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
            <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <img
              alt="Icon"
              height={277*1.4}
              src={icon}
              width={225*1.4}
            />
          </div>
        <div
            style={{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 80,
              fontFamily: '"Tourney"',
              color: '#F2F2F2',
              marginTop: 30,
              padding: '0 20px',
              lineHeight: 1,
              whiteSpace: 'pre-wrap',
            }}
          >
            {title.toUpperCase()}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Tourney',
            data: fontData,
            style: 'bold',
          },
        ],
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}