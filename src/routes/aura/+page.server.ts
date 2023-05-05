import SpotifyFetch from '$lib/server/spotifyFetch';
import { calcColourInGradient } from '$lib/server/calcColourInGradient';
import type { AudioFeatures, Track } from 'spotify-types';
import type { PageServerLoad } from './$types';
import type { MinMaxFeaturesSongs } from '../../types/minMaxFeaturesSongs.type';
import type { DesiredFeatures } from '../../types/desiredFeatures.type';
import type { FeatureColours } from '../../types/featureColours.type';
import { FeatureBounds } from '../../types/featureBounds.enum';
import { DanceabilityColourStops } from '../../types/danceabilityColourStops.enum';
import { EnergyColourStops } from '../../types/energyColourStops.enum';
import { ValenceColourStops } from '../../types/valenceColourStops.enum';

export const load = (async ({ cookies }) => {
	const token: string = cookies.get('token') || '';

	const getAuraColours = async () => {
		const topTracksParams = new URLSearchParams({
			limit: '5',
			time_range: 'medium_term'
		});

		const topTracks = await SpotifyFetch.get('me/top/tracks?' + topTracksParams.toString(), token);

		const trackIDs: string[] = topTracks.items.map((item: Track) => item.id);

		const featuresParams = new URLSearchParams({
			ids: trackIDs.join(',')
		});
		const features: { [audio_features: string]: AudioFeatures[] } = await SpotifyFetch.get(
			'audio-features?' + featuresParams.toString(),
			token
		);

		const minMaxFeaturesSongs: MinMaxFeaturesSongs = {
			maxValenceSong: '',
			minValenceSong: '',
			maxEnergySong: '',
			minEnergySong: '',
			maxDanceabilitySong: '',
			minDanceabilitySong: ''
		};

		// find the song for min/max of each metric
		const maxValence = features.audio_features.reduce((max, feature) =>
			max.valence > feature.valence ? max : feature
		);
		minMaxFeaturesSongs.maxValenceSong = topTracks.items.find(
			(track: Track) => track.id == maxValence.id
		).name;

		const minValence = features.audio_features.reduce((min, feature) =>
			min.valence < feature.valence ? min : feature
		);
		minMaxFeaturesSongs.minValenceSong = topTracks.items.find(
			(track: Track) => track.id == minValence.id
		).name;

		const maxEnergy = features.audio_features.reduce((max, feature) =>
			max.energy > feature.energy ? max : feature
		);
		minMaxFeaturesSongs.maxEnergySong = topTracks.items.find(
			(track: Track) => track.id == maxEnergy.id
		).name;

		const minEnergy = features.audio_features.reduce((min, feature) =>
			min.energy < feature.energy ? min : feature
		);
		minMaxFeaturesSongs.minEnergySong = topTracks.items.find(
			(track: Track) => track.id == minEnergy.id
		).name;

		const maxDanceability = features.audio_features.reduce((max, feature) =>
			max.danceability > feature.danceability ? max : feature
		);
		minMaxFeaturesSongs.maxDanceabilitySong = topTracks.items.find(
			(track: Track) => track.id == maxDanceability.id
		).name;

		const minDanceability = features.audio_features.reduce((min, feature) =>
			min.danceability < feature.danceability ? min : feature
		);
		minMaxFeaturesSongs.minDanceabilitySong = topTracks.items.find(
			(track: Track) => track.id == minDanceability.id
		).name;

		const desiredFeatures: DesiredFeatures[] = features.audio_features.map((feature) => ({
			danceability: feature.danceability,
			energy: feature.energy,
			valence: feature.valence
		}));

		let danceabilityAverage = 0;
		let energyAverage = 0;
		let valenceAverage = 0;

		for (let i = 0; i < desiredFeatures.length; i++) {
			danceabilityAverage += desiredFeatures[i].danceability;
			energyAverage += desiredFeatures[i].energy;
			valenceAverage += desiredFeatures[i].valence;
		}

		danceabilityAverage /= desiredFeatures.length;
		energyAverage /= desiredFeatures.length;
		valenceAverage /= desiredFeatures.length;

		const featureColours: FeatureColours = {
			danceability: '',
			energy: '',
			valence: ''
		};

		if (danceabilityAverage > FeatureBounds.MIN && danceabilityAverage <= FeatureBounds.FIRST) {
			featureColours['danceability'] =
				'#' +
				calcColourInGradient(
					DanceabilityColourStops.MIN,
					DanceabilityColourStops.FIRST,
					danceabilityAverage
				);
		} else if (
			danceabilityAverage > FeatureBounds.FIRST &&
			danceabilityAverage <= FeatureBounds.SECOND
		) {
			featureColours['danceability'] =
				'#' +
				calcColourInGradient(
					DanceabilityColourStops.FIRST,
					DanceabilityColourStops.SECOND,
					(danceabilityAverage - 0.33) / 0.33
				);
		} else if (
			danceabilityAverage > FeatureBounds.SECOND &&
			danceabilityAverage <= FeatureBounds.MAX
		) {
			featureColours['danceability'] =
				'#' +
				calcColourInGradient(
					DanceabilityColourStops.SECOND,
					DanceabilityColourStops.MAX,
					(danceabilityAverage - 0.67) / 0.33
				);
		}

		if (energyAverage > FeatureBounds.MIN && energyAverage <= FeatureBounds.FIRST) {
			featureColours['energy'] =
				'#' + calcColourInGradient(EnergyColourStops.MIN, EnergyColourStops.FIRST, energyAverage);
		} else if (energyAverage > FeatureBounds.FIRST && energyAverage <= FeatureBounds.SECOND) {
			featureColours['energy'] =
				'#' +
				calcColourInGradient(
					EnergyColourStops.FIRST,
					EnergyColourStops.SECOND,
					(energyAverage - 0.33) / 0.33
				);
		} else if (energyAverage > FeatureBounds.SECOND && energyAverage <= FeatureBounds.MAX) {
			featureColours['energy'] =
				'#' +
				calcColourInGradient(
					EnergyColourStops.SECOND,
					EnergyColourStops.MAX,
					(energyAverage - 0.67) / 0.33
				);
		}

		if (valenceAverage > FeatureBounds.MIN && valenceAverage <= FeatureBounds.FIRST) {
			featureColours['valence'] =
				'#' +
				calcColourInGradient(ValenceColourStops.MIN, ValenceColourStops.FIRST, valenceAverage);
		} else if (valenceAverage > FeatureBounds.FIRST && valenceAverage <= FeatureBounds.SECOND) {
			featureColours['valence'] =
				'#' +
				calcColourInGradient(
					ValenceColourStops.FIRST,
					ValenceColourStops.SECOND,
					(valenceAverage - 0.33) / 0.33
				);
		} else if (valenceAverage > FeatureBounds.SECOND && valenceAverage <= FeatureBounds.MAX) {
			featureColours['valence'] =
				'#' +
				calcColourInGradient(
					ValenceColourStops.SECOND,
					ValenceColourStops.MAX,
					(valenceAverage - 0.67) / 0.33
				);
		}

		return featureColours;
	};

	return {
		featureColours: getAuraColours()
	};
}) satisfies PageServerLoad;
