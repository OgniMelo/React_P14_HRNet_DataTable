import { ChangeEvent, useEffect, useState } from 'react'
import './styles/style.sass'

export default ({ data, columns }: { data: Array<{ [key: string]: string }>; columns: Array<{ title: string; data: string }> }) => {
	const [filteredData, setFilteredData] = useState<Array<{ [key: string]: string }>>(data)
	const [showNb, setShowNb] = useState<number>(10)
	const [sorting, setSorting] = useState<{ column: string; type: string }>({ column: '', type: 'asc' })
	const [search, setSearch] = useState<string>('')
	const [pageNb, setPageNb] = useState<number>(1)
	const [maxPage, setMaxPage] = useState<number>(Math.ceil(filteredData.length / showNb))

	useEffect(() => {
		handleSorting()
	}, [])

	useEffect(() => {
		setMaxPage(Math.ceil(filteredData.length / showNb))
	}, [filteredData, showNb])

	const handleSelectChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
		setShowNb(+value)
	}

	const handleSearch = ({ target: { value: searchValue } }: ChangeEvent<HTMLInputElement>) => {
		setSearch(searchValue)
		searchValue ? setFilteredData((prev) => [...prev.filter((data) => Object.values(data).find((value) => value.includes(searchValue)))]) : setFilteredData([...data])
	}

	const handleSorting = (column?: string) => {
		const prevSorting = { ...sorting }

		if (!column) {
			setSorting((prev) => (prev.column ? { ...prev } : { column: columns[0].data, type: 'asc' }))
			if (!filteredData.length) {
				return
			}
			if (!prevSorting.column) {
				if (isNaN(+filteredData[0][columns[0].data])) {
					setFilteredData((prev) => [...prev.sort((a, b) => a[columns[0].data].localeCompare(b[columns[0].data]))])
				} else {
					setFilteredData((prev) => [...prev.sort((a, b) => +a[columns[0].data] - +b[columns[0].data])])
				}
			}
			return
		}

		setSorting((prev) => (prev.column === column ? (prev.type === 'asc' ? { ...prev, type: 'desc' } : { ...prev, type: 'asc' }) : { column, type: 'asc' }))

		if (prevSorting.column === column) {
			if (prevSorting.type === 'asc') {
				if (isNaN(+filteredData[0][column])) {
					setFilteredData((prev) => [...prev.sort((a, b) => b[column].localeCompare(a[column]))])
				} else {
					setFilteredData((prev) => [...prev.sort((a, b) => +b[column] - +a[column])])
				}
			} else {
				if (isNaN(+filteredData[0][column])) {
					setFilteredData((prev) => [...prev.sort((a, b) => a[column].localeCompare(b[column]))])
				} else {
					setFilteredData((prev) => [...prev.sort((a, b) => +a[column] - +b[column])])
				}
			}
		} else {
			if (isNaN(+filteredData[0][column])) {
				setFilteredData((prev) => [...prev.sort((a, b) => a[column].localeCompare(b[column]))])
			} else {
				setFilteredData((prev) => [...prev.sort((a, b) => +a[column] - +b[column])])
			}
		}
	}

	const handlePageChange = (direction: string) => {
		direction === 'prev'
			? setPageNb((prev) => {
					return prev === 1 ? 1 : prev - 1
			  })
			: setPageNb((prev) => {
					return prev === maxPage ? maxPage : prev + 1
			  })
	}

	const handlePageNumChange = (num: number) => {
		setPageNb(num)
	}

	return (
		<div className='table_container'>
			<div className='table_length'>
				<label>
					Show{' '}
					<select onChange={handleSelectChange}>
						<option value='10'>10</option>
						<option value='25'>25</option>
						<option value='50'>50</option>
						<option value='100'>100</option>
					</select>{' '}
					entries
				</label>
			</div>
			<div className='table_filter'>
				<label>
					Search:
					<input type='search' value={search} onChange={handleSearch} />
				</label>
			</div>
			<table className='data_table'>
				<thead>
					<tr>
						{columns.map((column, index) => (
							<th key={index} className={sorting.column === column.data ? (sorting.type === 'asc' ? 'sorting_asc' : 'sorting_desc') : 'sorting'} onClick={() => handleSorting(column.data)}>
								{column.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{filteredData.length ? (
						filteredData.slice((pageNb - 1) * showNb, (pageNb - 1) * showNb + showNb).map((data, index) => (
							<tr key={index} className={index % 2 ? 'even' : 'odd'}>
								{columns.map((column, index) => (
									<td key={index} className={sorting.column === column.data ? 'sorting' : ''}>
										{data[column.data]}
									</td>
								))}
							</tr>
						))
					) : (
						<tr className='odd'>
							<td className='table_empty' colSpan={columns.length}>
								No data available in table
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<div className='table_info'>
				Showing {filteredData.length ? (pageNb - 1) * showNb + 1 : 0} to {filteredData.slice(0, (pageNb - 1) * showNb + showNb).length} of {data.length} entries
			</div>
			<div className='table_paginate'>
				<a className={'paginate_button' + (pageNb === 1 ? ' disabled' : '')} onClick={() => handlePageChange('prev')}>
					Previous
				</a>
				<span>
					{filteredData.length
						? new Array(maxPage).fill(0).map((data, page) => (
								<a key={page + 1} className={'paginate_button' + (pageNb === page + 1 ? ' current' : '')} onClick={() => handlePageNumChange(page + 1)}>
									{page + 1}
								</a>
						  ))
						: null}
				</span>
				<a className={'paginate_button' + (pageNb >= maxPage ? ' disabled' : '')} onClick={() => handlePageChange('next')}>
					Next
				</a>
			</div>
		</div>
	)
}

