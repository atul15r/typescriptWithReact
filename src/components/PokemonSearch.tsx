import React, { Component } from "react";
import User from "../interfaces/User.interface";

interface SearchState {
	error: boolean;
	superhero: SuperHero;
}

interface SuperHero {
	name: string;
	fullName: string;
	placeOfBirth: string;
	imageUrl: string;
}

export class SuperHeroSearch extends Component<User, SearchState> {
	superheroRef: React.RefObject<HTMLInputElement>;
	constructor(props: User) {
		super(props);
		this.state = {
			error: false,
			superhero: {
				name: "",
				fullName: "",
				placeOfBirth: "",
				imageUrl: "",
			},
		};
		this.superheroRef = React.createRef();
	}
	onSearchClick = (): void => {
		const inputValue = this.superheroRef.current?.value;

		fetch(
			`https://raw.githubusercontent.com/akabab/superhero-api/0.2.0/api/id/${inputValue}.json`
		).then(res => {
			if (res.status !== 200) {
				this.setState({ error: true });
				return;
			}
			res.json().then(data => {
				console.log(data);

				this.setState({
					error: false,
					superhero: {
						name: data.name,
						fullName: data.biography.fullName,
						placeOfBirth: data.biography.placeOfBirth,
						imageUrl: data.images.sm,
					},
				});
			});
		});
	};
	addNumbers = (a: number, b: number): number => {
		return a + b;
	};
	render() {
		const { name: userName, numberOfSuperheros } = this.props;
		const { error, superhero } = this.state;

		let resultMarkup;

		if (error) {
			resultMarkup = <p>SuperHero not found, please try again</p>;
		} else if (this.state.superhero) {
			resultMarkup = (
				<div>
					{superhero.imageUrl && (
						<img
							src={superhero.imageUrl}
							alt='superhero'
							className='superhero-image'
						/>
					)}
					{superhero.name && (
						<div>
							SuperHero :{superhero.name} <br />
							FullName: {superhero.fullName} <br />
							PlaceOfBirth:{" "}
							{superhero.placeOfBirth !== "-"
								? superhero.placeOfBirth
								: "not found"}
						</div>
					)}
				</div>
			);
		}

		return (
			<div>
				<p>
					{userName}{" "}
					{numberOfSuperheros && (
						<span>has {numberOfSuperheros} superhero</span>
					)}
				</p>
				<input type='text' ref={this.superheroRef} />
				<button onClick={this.onSearchClick} className='my-button'>
					Search
				</button>
				{resultMarkup}
			</div>
		);
	}
}

export default SuperHeroSearch;
