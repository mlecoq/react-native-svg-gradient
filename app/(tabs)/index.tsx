import {Image, StyleSheet, Platform, View, Text} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {SvgUri} from 'react-native-svg';
import {useEffect, useState} from 'react';
import {BlendColor, Canvas, fitbox, Group, ImageSVG, Paint, rect, Skia, SkSVG} from '@shopify/react-native-skia';

export default function HomeScreen() {
  const [svg, setSVG] = useState<SkSVG | null>(null);
  useEffect(() => {
    let canceled = false;
    const fetchSvg = async () => {
      try {
        const resp = await fetch(
          'https://res.cloudinary.com/azzapp-dev/image/upload/q_auto:best/y7rwlt0937ff4dgulmv1ywdm',
        );
        if (canceled) {
          return;
        }
        if (!resp.ok) {
          throw new Error(
            `Failed to fetch ${'https://res.cloudinary.com/azzapp-dev/image/upload/q_auto:best/y7rwlt0937ff4dgulmv1ywdm'}`,
          );
        }
        const svgSrc = await resp.text();
        if (canceled) {
          return;
        }
        setSVG(Skia.SVG.MakeFromString(svgSrc));
      } catch (e) {
        if (canceled) {
          return;
        }
        console.warn(
          `Failed to load SVG: ${'https://res.cloudinary.com/azzapp-dev/image/upload/q_auto:best/y7rwlt0937ff4dgulmv1ywdm'}`,
          e,
        );

        setSVG(null);
      }
    };
    fetchSvg();

    return () => {
      canceled = true;
    };
  }, []);

  const svgWidth = svg?.width() ?? 0;
  const svgHeight = svg?.height() ?? 0;

  const src = rect(0, 0, svgWidth, svgHeight);
  const dst = rect(0, 0, 200, 200);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>react-native-svg</Text>
      <View style={{width: 200, height: 200, borderWidth: 1, borderColor: 'black'}} pointerEvents="none">
        <SvgUri
          width="100%"
          height="100%"
          uri={'https://res.cloudinary.com/azzapp-dev/image/upload/q_auto:best/y7rwlt0937ff4dgulmv1ywdm'}
          color={'#fff444'}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>
      <Text>react-native-skia</Text>
      {svg && (
        <Canvas style={{width: 200, height: 200}} opaque>
          <Group
            transform={fitbox('fill', src, dst)}
            layer={
              <Paint>
                <BlendColor color={'#fff444'} mode="srcATop" />
              </Paint>
            }
          >
            <ImageSVG svg={svg} width={svgWidth} height={svgHeight} />
          </Group>
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
