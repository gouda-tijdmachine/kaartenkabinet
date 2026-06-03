# Verslag Rotterdam Tijdmachine

## 3. Kaartviewer – Basisopzet

### 3.1 Historische kaart laden via Allmaps

De Allmaps Plugin voor MapLibre maakt het mogelijk om gedigitaliseerde historische kaarten te laden via georeferentie-annotaties. Per kaart is een annotatie-URL opgeslagen in data.ts. Bij het selecteren van een kaart wordt de WarpedMapLayer gecleared en opnieuw geladen met de nieuwe annotatie. De kaarten zijn afkomstig van instellingen zoals het Stadsarchief Rotterdam, het Nationaal Archief en de Rijksdienst voor Cultureel Erfgoed.

In het navigatiepaneel is een slider toegevoegd waarmee de gebruiker de transparantie van de historische kaartlaag kan aanpassen. Dit maakt het mogelijk om de historische kaart te vergelijken met de moderne ondergrond. De waarde wordt opgeslagen in de globale viewState store.

### 3.2 Kaartcollectie en navigatiepaneel

Er is een zijpaneel gebouwd (Nav.svelte) waarmee de gebruiker kan wisselen tussen historische kaarten. De kaarten worden weergegeven in een lijst met het jaar en een korte naam. Het actieve jaar wordt bijgehouden via een $state variabele, zodat de geselecteerde kaart visueel gemarkeerd wordt. Bij het klikken op een kaart wordt de bijbehorende annotatie geladen op de kaart.

### 3.3 Vergelijkingsmodus – twee kaarten naast elkaar

De vergelijkingsmodus stelt gebruikers in staat om twee historische kaarten naast elkaar te bekijken. Dit wordt geactiveerd via de "Vergelijken" knop in de header. 

**Hoe het werkt:**
- Wanneer vergelijken actief is, worden twee kaarten naast elkaar weergegeven
- Aan elke kaart is een apart navigatiepaneel gekoppeld, zodat de gebruiker verschillende kaarten voor links en rechts kan kiezen
- De kaarten worden **gesynchroniseerd**: als je de linkerkaart verschuift of inzoomt, volgt de rechterkaart automatisch
- Beide kaarten hebben een aparte transparantie slider

**State management:**
- De vergelijkingsmodus gebruikt de globale `comparison` store met:
  - `active`: of de modus aan/uit is
  - `leftAnnotation` en `rightAnnotation`: welke kaarten gekozen zijn
  - `leftOpacity` en `rightOpacity`: transparantie per kaart

**Props doorgeven:**
- De kaarten ontvangen via `$props` de annotatie en opacity. Dit maakt het mogelijk dezelfde `Map.svelte` component tweemaal te gebruiken met verschillende waarden
- De `Nav` componenten ontvangen `onSelect` callback zodat wijzigingen in de zijpanelen meteen beide kaarten updaten

## 6. Kaartinfo en Download

### 6.1 Kaartinfo paneel

In het navigatiepaneel is een informatieblok toegevoegd dat details toont over de geselecteerde historische kaart. Dit bevat het jaar, de broninstelling en het formaat (IIIF / GeoRef). De informatie wordt automatisch bijgewerkt wanneer de gebruiker een andere kaart selecteert.

### 6.2 Download knop

Er is een downloadknop toegevoegd waarmee de gebruiker de historische kaart kan downloaden of de originele bronpagina kan openen. Als de kaart een directe IIIF-afbeelding heeft, wordt een directe download-URL opgebouwd. Anders opent de knop de bronpagina van de betreffende instelling in een nieuw tabblad.
