<?php
/**
 * Created by PhpStorm.
 * User: jdi
 * Date: 12/12/2018
 * Time: 9:26 μμ
 */

namespace App\Services;


use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Service class for retrieving and persisting exchange rates. Persists rates in user session.
 * On new user session uses some fixed rates to prepopulate session.
 *
 * @package App\Services
 */
class RatesService
{
    private $storage;

    public function __construct(SessionInterface $session)
    {
        $this->storage = $session;
    }

    /**
     * Retrieve exchange rates.
     *
     * @return array|mixed
     */
    public function getExchangeRates()
    {
        $val = $this->storage->get('rates');
        if (empty($val)) {
            $val = [
                'EUR' => [
                    'rates' => [
                        'USD' => 1.3764,
                        'CHF' => 1.2079,
                        'GBP' => 0.8731,
                    ]
                ],
                'USD' => [
                    'rates' => [
                        'EUR' => 1/1.3764,
                        'CHF' => 1/1.1379,
                        'JPY' => 76.7200,
                        'CAD' => 1.3357,
                    ]
                ],
                'CAD' => [
                    'rates' => [
                        'GBP' => 1/1.5648,
                    ]
                ],
                'GBP' => [
                    'rates' => [
                        'EUR' => 1/0.8731,
                        'CAD' => 1.5648,
                        'USD' => 1.2651,
                    ]
                ],
                'CHF' => [
                    'rates' => [
                        'USD' => 1.1379,
                        'EUR' => 1/1.2079,
                    ]
                ],
                'JPY' => [
                    'rates' => [
                        'USD' => 1/76.7200,
                    ]
                ],
                'NZD' => [
                    'rates' => [
                        'USD' => 0.6861,
                    ]
                ],
            ];
            $this->storage->set('rates', $val);
        }
        return $val;
    }

    /**
     * Persist a new exchange rate.
     *
     * @param $base   Base currency code.
     * @param $target Target currency code.
     * @param $rate   The exchange rate (float)
     *
     * @return bool
     * @throws \Exception
     */
    public function insert($base, $target, $rate)
    {
        $rates = $this->storage->get('rates');
        if (isset($rates[$base]['rates'][$target])) {
            throw new \Exception('Rate exists!');
        }
        $rates[$base]['rates'][$target] = $rate;
        $this->storage->set('rates', $rates);
        return true;
    }

    /**
     * Update an existing exchange rate.
     *
     * @param $base   Base currency code.
     * @param $target Target currency code.
     * @param $rate   The exchange rate (float)
     *
     * @return bool
     * @throws \Exception
     */
    public function update($base, $target, $rate)
    {
        $rates = $this->storage->get('rates');
        if (!isset($rates[$base]['rates'][$target])) {
            throw new \Exception('Rate does NOT exist!');
        }
        $rates[$base]['rates'][$target] = $rate;
        $this->storage->set('rates', $rates);
        return true;
    }
}