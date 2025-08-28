// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chart.bar.fill': 'bar-chart',
  'person.3.fill': 'group',
  'gearshape.fill': 'settings',
  'ellipsis.circle.fill': 'more-horiz',
  'creditcard.fill': 'credit-card',
  'creditcard': 'payment',
  'person.fill': 'person',
  'person': 'person-outline',
  'cup.and.saucer.fill': 'local-cafe',
  'star.fill': 'star',
  'birthday.cake.fill': 'cake',
  'leaf.fill': 'eco',
  'fork.knife': 'restaurant',
  'arrow.right.square': 'logout',
  'person.badge.plus': 'person-add',
  'person.crop.circle.badge.checkmark': 'verified-user',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  'briefcase.fill': 'work',
  'location.fill': 'location-on',
  'gift.fill': 'card-giftcard',
  'calendar': 'calendar-today',
  'shield.checkmark.fill': 'verified',
  'pencil': 'edit',
  'tag.fill': 'local-offer',
  'person.2.fill': 'people',
  'printer.fill': 'print',
  'plus.circle.fill': 'add-circle',
  'minus.circle.fill': 'remove-circle',
  'minus': 'remove',
  'plus': 'add',
  'cart': 'shopping-cart',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'clock.fill': 'access-time',
  'archivebox.fill': 'inventory',
  'cube.box.fill': 'inventory-2',
  'cube.box': 'inventory',
  'lock.fill': 'lock',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'info.circle.fill': 'info',
  'exclamationmark.triangle': 'warning',
  'bag': 'shopping-bag',
  'text.book.closed.fill': 'menu-book',
  'square.and.arrow.up': 'share',
  'doc.text.fill': 'description',
  'table.furniture.fill': 'table-restaurant',
  'power': 'power-settings-new',
  'arrow.clockwise': 'refresh',
  'exclamationmark.triangle.fill': 'warning',
  'archivebox': 'archive',
  'magnifyingglass': 'search',
  'trash': 'delete',
  'trash.fill': 'delete-forever',
  'square.grid.2x2': 'apps',
  'dollarsign.circle': 'attach-money',
  'envelope': 'email',
  'phone': 'phone',
  'takeoutbag.and.cup.and.straw': 'takeout-dining',
  'carrot': 'restaurant',
  'waterbottle': 'local-drink',
  'pause.circle.fill': 'pause-circle-filled',
  'questionmark.circle.fill': 'help',
  'ruler.fill': 'straighten',
  'multiply.circle.fill': 'clear',
  'shippingbox.fill': 'inventory',
  'takeoutbag.and.cup.and.straw.fill': 'takeout-dining',
  'carrot.fill': 'restaurant',
  'wineglass.fill': 'wine-bar',
  'bag.fill': 'shopping-bag',
  'drop.fill': 'water-drop',
  'sun.max.fill': 'wb-sunny',
  'camera.fill': 'camera-alt',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.down': 'keyboard-arrow-down',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  onPress,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  onPress?: () => void;
}) {
  const icon = <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
  
  if (onPress) {
    const { TouchableOpacity } = require('react-native');
    return <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>;
  }
  
  return icon;
}
