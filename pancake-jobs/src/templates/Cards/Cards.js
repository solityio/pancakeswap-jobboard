import React, {useState, useEffect} from 'react';
import Style from './Cards.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {getCards} from "../../store/actions/cards";
import BaseCard from "../../components/BaseCard";
import {Input, SearchIcon, CardsLayout, Toggle} from "@pancakeswap/uikit";
import Select from "../../components/Select/Select";


const Cards = () => {
    const cards = useSelector((state) => state?.rootReducer.cards.records);
    const [cardList, setCardList] = useState(cards);
    const [filterByName, setFilterByName] = useState('');
    const [filterJoType, setFilterJoType] = useState([]);
    const [isChecked, setIsChecked] = useState(false);


    const dispatch = useDispatch();
    const isCardList = !!cardList?.length;
    useEffect(() => {
        dispatch(getCards());
    }, []);

    useEffect(() => {
        setCardList(cards?.filter(customFilter))
    }, [cards, filterByName, filterJoType])

    const toggle = () => setIsChecked(!isChecked);
    const customFilter = (item) => {
        let isName = false;
        let isType = false;

        if (filterByName?.toLowerCase()?.length > 2) {
            isName = item?.fields?.Name?.toLowerCase().includes(filterByName?.toLowerCase())
        } else {
            isName = true;
        }

        if (filterJoType?.length) {
            isType = filterJoType.some(itemClass => item?.fields['Job Type'].includes(itemClass))
        } else {
            isType = true;
        }

        return isName && isType;
    }

    const handleSearch = (e) => {
        setFilterByName(e?.target?.value)
    };



    const handleSortOptionChange = (event, value) => {
        setFilterJoType(value)
    };



    return (
        <>
            <div className={Style.wrap_filter}>
                <div className={Style.search_wrap}>
                    <Input type="text" scale="lg" width="100%" onChange={handleSearch}
                           placeholder="Search for jobs..."/>
                    <SearchIcon/>
                </div>

                <CardsLayout>

                    <Select
                        options={[

                            {
                                value: 'Full Time',
                                label: 'Full Time'
                            },{
                                value: 'Freelance',
                                label: 'Freelance'
                            },
                        ]}
                        onOptionChange={handleSortOptionChange}
                    />
                    <div className={`${Style.wrap} ${Style.toggle}`}>
                        <Toggle checked={isChecked} onChange={toggle} scale="sm"/>
                        <p>Option to pay in crypto</p>
                    </div>
                </CardsLayout>
            </div>
            <div className={Style.wrap_list}>
                {isCardList ? (
                    cardList.map((card) => {

                        const date = card.createdTime;
                        let currentDate = Date.parse(new Date());
                        let days = (currentDate - Date.parse(date)) / 86400000;

                        return (
                            <BaseCard
                                key={card.id}
                                image={card.fields['Main Image'][0].url}
                                name={card.fields.Name}
                                type={card.fields['Job Type']}
                                description={card.fields['Short Description']}
                                date={Math.round(days)}
                            />
                        )
                    })
                ) : (
                    <p className={Style.loading_text}>No results</p>
                )}
            </div>
        </>
    );
}
export default Cards
