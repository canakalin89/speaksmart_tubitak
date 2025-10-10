# **App Name**: KonuşOyna

## Core Features:

- Anonim/E-posta Girişi: Öğrencilerin anonim veya e-posta ile giriş yapabilmesi. E-posta ile kayıt/giriş için Firebase Auth kullanılır.
- Konuşma Görevleri: Öğretmenlerin yönetici paneli üzerinden yeni konuşma görevleri oluşturabilmesi ve mevcut görevleri yönetebilmesi. Her görev, öğrencinin konuşarak tamamlayabileceği bir senaryo içerir. Firestore'da saklanır.
- Web Speech API Entegrasyonu: Web Speech API (STT ve TTS) kullanarak öğrencinin konuşmasını metne çevirme (STT) ve görev yönergelerini sesli olarak okuma (TTS).
- İlerleme Kaydetme: Öğrencinin görevlerdeki ilerlemesini (tamamlanma durumu, deneme sayısı vb.) Firestore'da saklama.
- Çevrimdışı Destek: IndexedDB kullanarak görevleri ve öğrenci ilerlemesini çevrimdışı olarak saklama. Uygulama çevrimiçi olduğunda verileri Firestore ile senkronize etme.
- Yapay Zekâ Destekli Değerlendirme: Öğrencinin konuşmasını analiz ederek telaffuz, akıcılık ve dilbilgisi açısından geri bildirim sağlayan bir araç (tool). Bu özellik, konuşma analizi için bir yapay zekâ modelini kullanır. Ancak, bu MVP'de temel bir sürüm sunulacak ve daha gelişmiş analizler sonraki aşamalara bırakılacak.
- Öğretmen Yönetim Paneli: Öğretmenlerin görevleri yönetebileceği, öğrencilerin ilerlemesini izleyebileceği ve genel ayarları yapılandırabileceği bir arayüz.

## Style Guidelines:

- Primary color: Parlak mavi (#42A5F5) güven ve açıklığı temsil eder.
- Background color: Açık mavi (#E3F2FD), birincil rengin hafifçe doygunluğu azaltılmış versiyonu.
- Accent color: Turuncu (#FFB74D), etkileşimli öğeler ve önemli vurgular için kullanılır. Maviye analog bir renktir.
- Body ve başlık fontu: 'PT Sans', modern ve okunabilir bir yazı tipi.
- Görev türlerini ve öğrenci eylemlerini temsil eden basit ve anlaşılır ikonlar.
- Temiz ve sezgisel bir düzen. Öğrenci ve öğretmen arayüzleri arasında net bir ayrım.
- Görev geçişleri ve geri bildirimler için ince animasyonlar.