import React, {useRef} from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import type {SharedValue} from 'react-native-reanimated'
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'

import {WINDOWS_HEIGHT} from '@/Constants'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.8
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7
const SPACING = 10
const SIDE_CARD_OFFSET = (SCREEN_WIDTH - CARD_WIDTH) / 2

const CAROUSEL_DATA = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    photographer: 'Mountain Vista',
    subtitle: 'Peaks above the clouds',
    gradients: ['#0f2027', '#203a43', '#2c5364']
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    photographer: 'Arctic Dreams',
    subtitle: 'Northern lights dance',
    gradients: ['#134e5e', '#71b280', '#a8e6cf']
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    photographer: 'Ocean Serenity',
    subtitle: 'Where water meets sky',
    gradients: ['#2c3e50', '#3498db', '#5dade2']
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80',
    photographer: 'Desert Dunes',
    subtitle: 'Golden hour warmth',
    gradients: ['#c33764', '#e55d87', '#f093fb']
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    photographer: 'Forest Whispers',
    subtitle: 'Deep in the woodland',
    gradients: ['#1e3c72', '#2a5298', '#7e22ce']
  }
]
type ItemType = (typeof CAROUSEL_DATA)[0]

const AnimatedGradient = ({
  scrollX,
  item,
  index
}: {
  scrollX: SharedValue<number>
  item: ItemType
  index: number
}) => {
  const stylez = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING)
    ]
    return {
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0])
    }
  })

  return (
    <Animated.Image
      blurRadius={50}
      source={{uri: item.image}}
      style={[StyleSheet.absoluteFill, stylez]}
    />
  )
}

const CarouselCard = ({
  item,
  index,
  scrollX
}: {
  scrollX: SharedValue<number>
  item: ItemType
  index: number
}) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING)
  ]
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5])

    return {
      opacity: opacity
    }
  })

  const animatedImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollX.value, inputRange, [80, 0, 80])

    return {
      transform: [{translateY: translateY}]
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.cardContent}>
        <Text style={styles.photographerName}>{item.photographer}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.Image
          source={{uri: item.image}}
          style={[styles.cardImage, styles.card, animatedImageStyle]}
        />
      </View>
    </Animated.View>
  )
}

const AnimatedCarousel = () => {
  const scrollX = useSharedValue(0)
  const scrollViewRef = useRef(null)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    }
  })

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        {CAROUSEL_DATA.map((item, index) => (
          <AnimatedGradient scrollX={scrollX} item={item} index={index} />
        ))}
      </View>
      <Animated.FlatList
        data={CAROUSEL_DATA}
        ref={scrollViewRef}
        horizontal
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        style={{
          flexGrow: 0,
          marginTop: 'auto'
        }}
        scrollEventThrottle={1000 / 60}
        renderItem={({item, index}) => (
          <CarouselCard key={item.id} item={item} index={index} scrollX={scrollX} />
        )}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SIDE_CARD_OFFSET,
          alignItems: 'center',
          gap: SPACING
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    elevation: 10,
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.8,
    shadowRadius: 30,
    width: '100%'
  },
  cardContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
    width: CARD_WIDTH
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: (WINDOWS_HEIGHT - CARD_HEIGHT) / 4,
    padding: 24
  },
  cardGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    bottom: -10,
    left: -10,
    position: 'absolute',
    right: -10,
    top: -10,
    zIndex: -1
  },
  cardImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    backgroundColor: '#000',
    flex: 1
  },
  gradientLayer: {
    ...StyleSheet.absoluteFill
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
    height: 8,
    marginHorizontal: 5,
    width: 8
  },
  indicatorContainer: {
    alignItems: 'center',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0
  },
  photographerName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    fontWeight: '400'
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 60
  }
})
export default AnimatedCarousel
