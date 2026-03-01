// --- Définition des broches pour la LED RGB ---
// Ces broches sont des GPIO de l'ESP32.
// Connectez la broche rouge de votre LED RGB à la broche GPIO 2 de l'ESP32.
// Connectez la broche verte de votre LED RGB à la broche GPIO 4 de l'ESP32.
// Connectez la broche bleue de votre LED RGB à la broche GPIO 16 de l'ESP32.
//
// Pour une LED RGB à anode commune: la broche la plus longue (VCC) est connectée au 3.3V (ou 5V)
// et les broches R, G, B sont connectées via une résistance à la GPIO respective (logic LOW = ON).
// Pour une LED RGB à cathode commune: la broche la plus longue (GND) est connectée à la masse
// et les broches R, G, B sont connectées via une résistance à la GPIO respective (logic HIGH = ON).
//
// Le code ci-dessous est écrit pour une LED à cathode commune (HIGH = ON).
// Si vous avez une LED à anode commune, vous devrez inverser les valeurs de couleur (255-r, 255-g, 255-b).
const int LED_PIN_R = 2;  // GPIO pour la composante Rouge
const int LED_PIN_G = 4;  // GPIO pour la composante Verte
const int LED_PIN_B = 16; // GPIO pour la composante Bleue
// --- Configuration PWM (LED Control) ---
// La résolution de 8 bits signifie des valeurs de 0 à 255 pour la luminosité
#define
LEDC_TIMER_BIT
8
#define
LEDC_BASE_FREQ
5000 // Fréquence de 5 kHz pour le PWM
// Canaux LEDC (PWM) pour chaque couleur
#define
LEDC_CHANNEL_R
0
#define
LEDC_CHANNEL_G
1
#define
LEDC_CHANNEL_B
2
// --- Variables pour l'effet arc-en-ciel ---
byte
currentHue = 0; // La "teinte" actuelle, de 0 à 255 pour parcourir toutes les couleurs
// --- Fonctions ---
// Fonction pour définir la couleur de la LED RGB
void setLedColor(int
r, int
g, int
b
)
{
    // Écrit les valeurs de luminosité sur les canaux PWM respectifs
    ledcWrite(LEDC_CHANNEL_R, r);
    ledcWrite(LEDC_CHANNEL_G, g);
    ledcWrite(LEDC_CHANNEL_B, b);

    // Affiche les valeurs RGB sur le moniteur série
    Serial.printf("RGB: (%3d, %3d, %3d)\n", r, g, b);
}
// Fonction pour obtenir une couleur arc-en-ciel basée sur une position (0-255)
// Adaptée d'une fonction "Wheel" classique pour les LEDs
void getRainbowColor(byte
WheelPos, int & r, int & g, int & b
)
{
    WheelPos = 255 - WheelPos; // Inverse pour un défilement plus intuitif
    if (WheelPos < 85) {
        r = WheelPos * 3;
        g = 255 - WheelPos * 3;
        b = 0;
    } else if (WheelPos < 170) {
        WheelPos -= 85;
        r = 255 - WheelPos * 3;
        g = 0;
        b = WheelPos * 3;
    } else {
        WheelPos -= 170;
        r = 0;
        g = WheelPos * 3;
        b = 255 - WheelPos * 3;
    }
}
void setup()
{
    Serial.begin(115200);
    Serial.println("Démarrage de l'effet RGB sur ESP32 WROOM...");

    // Configure les canaux LEDC (PWM)
    // Canal 0 pour le Rouge
    ledcSetup(LEDC_CHANNEL_R, LEDC_BASE_FREQ, LEDC_TIMER_BIT);
    ledcAttachPin(LED_PIN_R, LEDC_CHANNEL_R);

    // Canal 1 pour le Vert
    ledcSetup(LEDC_CHANNEL_G, LEDC_BASE_FREQ, LEDC_TIMER_BIT);
    ledcAttachPin(LED_PIN_G, LEDC_CHANNEL_G);

    // Canal 2 pour le Bleu
    ledcSetup(LEDC_CHANNEL_B, LEDC_BASE_FREQ, LEDC_TIMER_BIT);
    ledcAttachPin(LED_PIN_B, LEDC_CHANNEL_B);

    Serial.println("Configuration PWM terminée.");
    Serial.println("Début de l'animation arc-en-ciel.");
}
void loop()
{
    int
    r_val, g_val, b_val;

    // Obtient la couleur arc-en-ciel pour la teinte actuelle
    getRainbowColor(currentHue, r_val, g_val, b_val);

    // Applique la couleur à la LED
    setLedColor(r_val, g_val, b_val);

    // Incrémente la teinte pour le prochain cycle
    currentHue++;

    // Délai pour contrôler la vitesse du défilement.
    // Vous pouvez ajuster cette valeur (en millisecondes) pour un effet plus rapide ou plus lent.
    delay(10);
}
