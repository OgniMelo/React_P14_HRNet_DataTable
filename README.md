OpenClassrooms React Developer Course - Project 14 - DataTable Component

# DataTable Component
Library made for the HRnet application. 

## Installation
```bash
npm i @ognimelo/hrnet-datatable
```

## Usage
### Example
```jsx
import DataTable from '@ognimelo/hrnet-datatable'

const columns = [
	{ title: 'First Name', data: 'firstName' },
	{ title: 'Last Name', data: 'lastName' },
	{ title: 'Date of Birth', data: 'dateOfBirth' },
	{ title: 'City', data: 'city' },
]

const data = [
	{
		firstName: 'Bob',
		lastName: 'Unicorn',
		dateOfBirth: '11/05/1995',
		city: 'Paris',
	}
]

export default () => {
	return (
		<div id='employee-div' className='container'>
			<h1>Data Table</h1>
			<DataTable columns={columns} data={data} />
		</div>
	)
}
```

### Component props
##### data
Data to display in the table. Type: `Array<{ [key: string]: string }>`
##### columns
Columns name and key value to display. Type: `Array<{ title: string; data: string }>`
