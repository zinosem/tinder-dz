# 📱 Guide pour créer le fichier .ipa LoveDZ

## ⚠️ Prérequis Importants

Pour créer un fichier .ipa (application iOS), tu as besoin de :

1. **Un Mac** avec macOS (obligatoire pour compiler iOS)
2. **Xcode** installé depuis l'App Store (gratuit)
3. **Un compte Apple Developer** ($99/an) pour distribuer sur l'App Store
   - OU tu peux tester sur ton propre iPhone gratuitement avec Xcode

---

## 🚀 Méthode 1 : Sur Mac (Recommandé)

### Étape 1 : Installer les outils

```bash
# Installer Node.js depuis https://nodejs.org

# Installer les dépendances
cd /chemin/vers/tinder-dz
npm install

# Initialiser Capacitor pour iOS
npx cap add ios
npx cap sync
```

### Étape 2 : Ouvrir dans Xcode

```bash
npx cap open ios
```

### Étape 3 : Dans Xcode

1. Sélectionne ton **Team** (compte Apple) dans Signing & Capabilities
2. Connecte ton iPhone avec un câble
3. Sélectionne ton iPhone comme destination
4. Clique sur **▶️ Run** pour installer sur ton iPhone

### Étape 4 : Créer le .ipa

1. Dans Xcode : **Product → Archive**
2. Une fois l'archive créée, clique sur **Distribute App**
3. Choisis **Ad Hoc** ou **App Store Connect**
4. Exporte le .ipa

---

## 🌐 Méthode 2 : Sans Mac (Services Cloud)

### Option A : Codemagic (Gratuit pour commencer)

1. Va sur [codemagic.io](https://codemagic.io)
2. Connecte ton repo GitHub
3. Configure le build iOS
4. Ils compilent sur leurs Mac et te donnent le .ipa

### Option B : AppFlow by Ionic

1. Va sur [ionic.io/appflow](https://ionic.io/appflow)
2. Upload ton projet
3. Build dans le cloud

### Option C : GitHub Actions (Gratuit)

Crée le fichier `.github/workflows/ios.yml` :

```yaml
name: Build iOS

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm install
        
      - name: Add iOS platform
        run: npx cap add ios
        
      - name: Sync Capacitor
        run: npx cap sync ios
        
      - name: Build iOS
        run: |
          cd ios/App
          xcodebuild -workspace App.xcworkspace \
            -scheme App \
            -configuration Release \
            -archivePath build/App.xcarchive \
            archive
            
      - name: Export IPA
        run: |
          cd ios/App
          xcodebuild -exportArchive \
            -archivePath build/App.xcarchive \
            -exportPath build/ipa \
            -exportOptionsPlist ExportOptions.plist
            
      - name: Upload IPA
        uses: actions/upload-artifact@v3
        with:
          name: LoveDZ.ipa
          path: ios/App/build/ipa/*.ipa
```

---

## 📲 Méthode 3 : Installer sans App Store

### AltStore (Gratuit, sans jailbreak)

1. Télécharge [AltStore](https://altstore.io) sur ton PC/Mac
2. Installe AltStore sur ton iPhone via iTunes/Finder
3. Transfère le .ipa vers ton iPhone
4. Ouvre avec AltStore pour l'installer

### Sideloadly (Alternative)

1. Télécharge [Sideloadly](https://sideloadly.io)
2. Connecte ton iPhone
3. Glisse le .ipa dans Sideloadly
4. Entre ton Apple ID
5. L'app s'installe sur ton iPhone

---

## 🎯 Résumé des options

| Méthode | Coût | Difficulté | Mac requis |
|---------|------|------------|------------|
| Xcode sur Mac | $99/an (Dev) | Moyenne | ✅ Oui |
| Codemagic | Gratuit/Payant | Facile | ❌ Non |
| GitHub Actions | Gratuit | Moyenne | ❌ Non |
| AltStore | Gratuit | Facile | ❌ Non |

---

## 💡 Conseil

Si tu veux juste **tester sur ton iPhone** sans payer :
1. Utilise la **PWA** (ajouter à l'écran d'accueil depuis Safari)
2. Ou utilise **AltStore** avec un .ipa

Si tu veux **publier sur l'App Store** :
1. Compte Apple Developer ($99/an) obligatoire
2. Utilise un Mac avec Xcode

---

## 📞 Besoin d'aide ?

La solution la plus simple reste la **PWA** - elle fonctionne exactement comme une app native sur iPhone moderne!
