# Рекомендации по изображениям для товаров

## Текущие изображения (с Unsplash, общие):
1. Сумка: `https://images.unsplash.com/photo-1590874103328-eac38a8b8e0a`
2. Часы: `https://images.unsplash.com/photo-1523170335258-f5ed11844a49`
3. Обувь: `https://images.unsplash.com/photo-1541643600914-78b084683601`
4. Колье: `https://images.unsplash.com/photo-1594623930572-300a301d4ecf`

## Предлагаемые замены на более конкретные/брендовые изображения:

### 1. Сумка Gucci
**Вариант A (Unsplash - выглядит как Gucci):**
- URL: `https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
- Альтернатива: `https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`
- Описание: Черная кожаная сумка с золотой фурнитурой, напоминающая Gucci Marmont.

**Вариант B (Официальный источник):**
- Скачать с официального сайта Gucci: https://www.gucci.com
- Поиск по запросу "GG Marmont small shoulder bag"
- Рекомендуется использовать для коммерческого проекта с разрешением.

### 2. Часы Rolex
**Вариант A (Unsplash - качественные часы):**
- URL: `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` (текущий, хороший)
- Альтернатива: `https://images.unsplash.com/photo-1674489732580-8ce6e1aa6b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`

**Вариант B (Официальный источник):**
- Сайт Rolex: https://www.rolex.com
- Модель: Rolex Submariner или Datejust
- Скачать изображения с высоким разрешением с официального сайта.

### 3. Обувь Prada
**Вариант A (Unsplash - дизайнерская обувь):**
- URL: `https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` (текущий)
- Альтернатива: `https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`

**Вариант B (Официальный источник):**
- Сайт Prada: https://www.prada.com
- Раздел обуви: Leather shoes

### 4. Ювелирное колье Louis Vuitton / Tiffany
**Вариант A (Unsplash - роскошное колье):**
- URL: `https://images.unsplash.com/photo-1594623930572-300a301d4ecf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` (текущий)
- Альтернатива: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`

**Вариант B (Официальный источник):**
- Сайт Tiffany & Co.: https://www.tiffany.com
- Раздел колье: Diamond necklaces

## Дополнительные изображения:

### Hero изображение (бутик):
- Текущее: `https://images.unsplash.com/photo-1558769132-cb1cb458eabe`
- Альтернатива (более роскошное): `https://images.unsplash.com/photo-1441986300917-64674bd600d8`

### About изображение (мастерская):
- Текущее: `https://images.unsplash.com/photo-1441986300917-64674bd600d8`
- Можно оставить.

## Инструкции по загрузке локальных копий:

### Способ 1: Скачивание через wget
```bash
# Создать папку для изображений
mkdir -p /home/pup6/.openclaw/workspace/builds/designer-goods-landing-v2/assets/images/products

# Скачать изображения (пример)
wget -O gucci-bag.jpg "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
wget -O rolex-watch.jpg "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
wget -O prada-shoes.jpg "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
wget -O necklace.jpg "https://images.unsplash.com/photo-1594623930572-300a301d4ecf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
wget -O hero-image.jpg "https://images.unsplash.com/photo-1558769132-cb1cb458eabe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"

# Переместить в папку assets
mv *.jpg /home/pup6/.openclaw/workspace/builds/designer-goods-landing-v2/assets/images/products/
```

### Способ 2: Ручное скачивание
1. Открыть каждый URL в браузере
2. Нажать правой кнопкой → "Сохранить изображение как"
3. Сохранить в папку `assets/images/products/`
4. Переименовать файлы:
   - `gucci-bag.jpg`
   - `rolex-watch.jpg`
   - `prada-shoes.jpg`
   - `necklace.jpg`
   - `hero-boutique.jpg`

### Способ 3: Использование официальных изображений (рекомендуется для продакшена)
1. Посетить официальные сайты брендов
2. Найти раздел "Пресса" или "Медиа"
3. Скачать официальные изображения продуктов (обычно доступны для прессы)
4. Сохранить в папку `assets/images/official/`
5. Обновить пути в HTML

## Обновление HTML:
После загрузки изображений заменить src в HTML:

```html
<!-- Пример для сумки -->
<img src="assets/images/products/gucci-bag.jpg" alt="Дизайнерская сумка Gucci">

<!-- Пример для часов -->
<img src="assets/images/products/rolex-watch.jpg" alt="Швейцарские часы Rolex">

<!-- Пример для обуви -->
<img src="assets/images/products/prada-shoes.jpg" alt="Кожаные туфли Prada">

<!-- Пример для колье -->
<img src="assets/images/products/necklace.jpg" alt="Ювелирное колье Tiffany">
```

## Оптимизация изображений:
1. Конвертировать в WebP для лучшего сжатия:
   ```bash
   convert gucci-bag.jpg gucci-bag.webp
   ```
2. Создать респонсивные версии разных размеров
3. Использовать lazy loading (уже есть в HTML)

## Права и лицензии:
- Изображения Unsplash: бесплатно для коммерческого использования, без указания авторства
- Официальные изображения брендов: требуется проверка лицензии, обычно разрешено для редакционного использования
- Для коммерческого сайта рекомендуется приобрести лицензию на стоковые изображения или использовать официальные медиа-материалы брендов